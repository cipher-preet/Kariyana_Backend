import mongoose, { Types } from "mongoose";
import { STATUS_CODE } from "../../Api";
import { productModel } from "../../Dashboard/Modals/Product.modals";
import { generateCloudFrontSignedUrl } from "../../utils/cloudfrontSigner";
import { childCategoryModel } from "../../Dashboard/Modals/ChildCategory.modal";
import { cartSchemaModel } from "../../Dashboard/Modals/cart.model";
import { Icart } from "../../types/CartTypes";
import { homePageModel } from "../../Dashboard/Modals/BuilfHomePage.modal";
import { BannersAndCaroselsModel } from "../../Dashboard/Modals/BannersAndCarosels";
import { ParentCategoryModel } from "../../Dashboard/Modals/Category.modal";
import { TrendModel } from "../../Dashboard/Modals/Trend.modal";
import { SearchQuery } from "../../types/Search";
import { Order } from "../Modals/order.model";
import { stat } from "node:fs";
import { IFeedback, IUser } from "../../types/Dashboardtypes";
import { FeedBack } from "../Modals/AppFeedback.modal";
import { ShopProfileModel } from "../../AuthenticationModule/Modals/ShopProfile.modal";

interface PaginationParams {
  limit?: number;
  cursor?: string;
}

export const getProductsBycategoryIdRepository = async (
  categoryId: string,
  { limit = 10, cursor }: PaginationParams,
) => {
  try {
    const query: any = {
      categoryId: new Types.ObjectId(categoryId),
      isActive: true,
    };

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const products = await productModel
      .find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .select({
        name: 1,
        images: 1,
        mrp: 1,
        sellingPrice: 1,
        unit: 1,
        quantityPerUnit: 1,
        tag: 1,
        offPercentage: 1,
      })
      .lean();

    const hasNextPage = products.length > limit;

    if (hasNextPage) {
      products.pop();
    }

    return {
      products,
      nextCursor: hasNextPage ? products[products.length - 1]._id : null,
      hasNextPage,
    };
  } catch (error) {
    console.log("error in product repo ", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------------

export const getProductsbyProductIdRepository = async (productId: string) => {
  try {
    const product = await productModel
      .findOne({ _id: new Types.ObjectId(productId), isActive: true })
      .select({
        name: 1,
        mrp: 1,
        sellingPrice: 1,
        unit: 1,
        quantityPerUnit: 1,
        reviewCount: 1,
        rating: 1,
        marketPrice: 1,
        sku: 1,
        subcategoryId: 1,
        brandId: 1,
      })
      .lean();

    if (!product) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "Product not Found",
      };
    }

    return product;
  } catch (error) {
    console.log("error in product repo ", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------------

export const getAllChildCategoriesRepository = async () => {
  try {
    const response = await childCategoryModel
      .find()
      .populate({ path: "parentCategoryId", select: "name" })
      .select("name image isActive")
      .lean();

    if (!response) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "Categories not Found",
      };
    }

    const categoriesWithSignedUrls = response.reduce(
      (acc: { [key: string]: any[] }, item) => {
        const parentName = (item.parentCategoryId as { name: string }).name;

        if (!acc[parentName]) {
          acc[parentName] = [];
        }
        acc[parentName].push({
          _id: item._id,
          name: item.name,
          isActive: item.isActive,
          images: generateCloudFrontSignedUrl(item.image),
        });

        return acc;
      },
      {},
    );

    return categoriesWithSignedUrls;
  } catch (error) {
    console.log("error in product repo ", error);
    throw error;
  }
};

//-----------------------------------------------------------------------------------------------------

export const getProductByChildCategoryIdRepository = async (
  childCatId: string,
  { limit = 10, cursor }: PaginationParams,
) => {
  try {
    const query: any = {
      subcategoryId: new Types.ObjectId(childCatId),
      isActive: true,
    };

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const products = await productModel
      .find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .select({
        name: 1,
        images: { $slice: 1 },
        mrp: 1,
        sellingPrice: 1,
        reviewCount: 1,
        unit: 1,
        quantityPerUnit: 1,
        rating: 1,
        marketPrice: 1,
        sku: 1,
        subcategoryId: 1,
      })
      .lean();

    const hasNextPage = products.length > limit;

    if (hasNextPage) {
      products.pop();
    }

    return {
      products,
      nextCursor: hasNextPage ? products[products.length - 1]._id : null,
      hasNextPage,
    };
  } catch (error) {
    console.log("error in product repo ", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------

// import mongoose from "mongoose";

export const syncCartRepository = async (FinalData: Icart) => {
  try {
    const userId = new mongoose.Types.ObjectId(FinalData.userId);

    const incomingItems = FinalData.items.map((item) => ({
      productId: new mongoose.Types.ObjectId(item.productId),
      quantity: item.quantity,
      price: item.price,
    }));

    const cart = await cartSchemaModel.findOneAndUpdate(
      { userId },
      [
        {
          $set: {
            items: { $ifNull: ["$items", []] },
          },
        },
        {
          $set: {
            items: {
              $let: {
                vars: {
                  existing: "$items",
                  incoming: incomingItems,
                },
                in: {
                  $concatArrays: [
                    {
                      $map: {
                        input: "$$existing",
                        as: "ex",
                        in: {
                          $let: {
                            vars: {
                              match: {
                                $first: {
                                  $filter: {
                                    input: "$$incoming",
                                    as: "in",
                                    cond: {
                                      $eq: ["$$in.productId", "$$ex.productId"],
                                    },
                                  },
                                },
                              },
                            },
                            in: {
                              $cond: [
                                { $ne: ["$$match", null] },
                                {
                                  $mergeObjects: [
                                    "$$ex",
                                    { quantity: "$$match.quantity" },
                                  ],
                                },
                                "$$ex",
                              ],
                            },
                          },
                        },
                      },
                    },
                    {
                      $filter: {
                        input: "$$incoming",
                        as: "in",
                        cond: {
                          $not: {
                            $in: [
                              "$$in.productId",
                              {
                                $map: {
                                  input: "$$existing",
                                  as: "ex",
                                  in: "$$ex.productId",
                                },
                              },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $set: {
            totalItems: {
              $reduce: {
                input: "$items",
                initialValue: 0,
                in: { $add: ["$$value", "$$this.quantity"] },
              },
            },
            subtotal: {
              $reduce: {
                input: "$items",
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    { $multiply: ["$$this.quantity", "$$this.price"] },
                  ],
                },
              },
            },
            lastUpdatedAt: FinalData.lastUpdatedAt,
          },
        },
      ],
      {
        new: true,
        upsert: true,
        updatePipeline: true,
      },
    );

    return {
      status: STATUS_CODE.OK,
      message: "Cart synced successfully",
      cart,
    };
  } catch (error) {
    console.error("Pipeline sync cart error", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------
type PopulatedProduct = {
  _id: Types.ObjectId;
  name: string;
  images: string[];
  unit: string;
  quantityPerUnit: string;
};

type CartItemPopulated = {
  productId: PopulatedProduct;
  quantity: number;
  price: number;
};

type CartPopulated = {
  userId: Types.ObjectId;
  items: CartItemPopulated[];
  totalItems: number;
  subtotal: number;
  lastUpdatedAt: number;
};

export const getCartByUserIdRepository = async (userId: string) => {
  try {
    const cart = await cartSchemaModel
      .findOne({ userId: userId })
      .populate({
        path: "items.productId",
        select: "name images unit quantityPerUnit",
      })
      .lean<CartPopulated>();

    if (!cart) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "Cart not found",
      };
    }
    const FinalResponse = {
      userId: cart?.userId,
      items: cart?.items.map((item) => {
        const { images, ...productWithoutImages } = item?.productId as any;

        return {
          productId: productWithoutImages._id,
          name: productWithoutImages.name,
          quantity: item.quantity,
          price: item.price,
          image: images?.length ? generateCloudFrontSignedUrl(images[0]) : null,
          unit: productWithoutImages.unit,
          quantityPerUnit: productWithoutImages.quantityPerUnit,
        };
      }),
      totalItems: cart?.totalItems,
      subtotal: cart?.subtotal,
      lastUpdatedAt: cart?.lastUpdatedAt,
    };

    return FinalResponse;
  } catch (error) {
    console.log("error in product repo ", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------------------------------------

export const incAndDecCartQuantityRepository = async (
  userId: string,
  productId: string,
  delta: number,
) => {
  try {
    const cartUpdate = await cartSchemaModel.updateOne(
      { userId },
      [
        {
          $set: {
            _computed: {
              $let: {
                vars: {
                  newItems: {
                    $filter: {
                      input: {
                        $map: {
                          input: "$items",
                          as: "item",
                          in: {
                            $cond: [
                              {
                                $eq: [
                                  "$$item.productId",
                                  new Types.ObjectId(productId),
                                ],
                              },
                              {
                                $cond: [
                                  {
                                    $lte: [
                                      { $add: ["$$item.quantity", delta] },
                                      0,
                                    ],
                                  },
                                  null,
                                  {
                                    $mergeObjects: [
                                      "$$item",
                                      {
                                        quantity: {
                                          $add: ["$$item.quantity", delta],
                                        },
                                      },
                                    ],
                                  },
                                ],
                              },
                              "$$item",
                            ],
                          },
                        },
                      },
                      as: "item",
                      cond: { $ne: ["$$item", null] },
                    },
                  },
                },
                in: {
                  items: "$$newItems",
                  totalItems: {
                    $sum: "$$newItems.quantity",
                  },
                  subtotal: {
                    $sum: {
                      $map: {
                        input: "$$newItems",
                        as: "i",
                        in: {
                          $multiply: ["$$i.quantity", "$$i.price"],
                        },
                      },
                    },
                  },
                },
              },
            },

            lastUpdatedAt: Date.now(),
          },
        },

        {
          $set: {
            items: "$_computed.items",
            totalItems: "$_computed.totalItems",
            subtotal: "$_computed.subtotal",
          },
        },
        {
          $unset: "_computed",
        },
      ],
      {
        updatePipeline: true,
      },
    );

    if (!cartUpdate) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "error while quantity updated",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Quantity Updated",
    };
  } catch (error) {
    console.log("error in product repo ", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------

export const getHomePageBannerAndProductRepository = async (
  limit = 2,
  cursor?: string | null,
) => {
  try {
    const query: any = {};

    if (cursor) {
      query._id = {
        $lt: new mongoose.Types.ObjectId(cursor),
      };
    }

    const homePages = await homePageModel
      .find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .select("-__v")
      .lean();

    const hasNextPage = homePages.length > limit;
    const pageDocs = hasNextPage ? homePages.slice(0, limit) : homePages;

    if (hasNextPage) homePages.pop();

    const data = pageDocs.map((item) => ({
      ...item,
      products: item.products.map((product: any) => ({
        ...product,
        images: generateCloudFrontSignedUrl(product.images),
      })),
    }));

    let banners: string[] = [];
    let carosels: string[] = [];
    if (!cursor) {
      const bannersAndCarosels = await BannersAndCaroselsModel.findOne({})
        .select("-__v")
        .lean();

      banners =
        bannersAndCarosels?.banners.map((item: any) =>
          generateCloudFrontSignedUrl(item),
        ) ?? [];
      carosels =
        bannersAndCarosels?.carosels.map((item: any) =>
          generateCloudFrontSignedUrl(item),
        ) ?? [];
    }

    return {
      data,
      ...(!cursor && { banners, carosels }),
      nextCursor: hasNextPage ? pageDocs[pageDocs.length - 1]._id : null,
      hasNextPage,
    };
  } catch (error) {
    console.log("error in product repo ", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------------------------------

export const getParentcatandTagDataRepository = async () => {
  try {
    const data = await ParentCategoryModel.find({})
      .select("name image")
      .limit(10)
      .lean();
    return data ?? [];
  } catch (error) {
    console.log("error in product repo ", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------------------------------------

export const getTrendSectionDataForHomePageRepository = async (
  limit: number,
  cursor?: string,
) => {
  try {
    const query: any = {};

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const trends = await TrendModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasNextPage = trends.length > limit;

    if (hasNextPage) {
      trends.pop();
    }
    return {
      trends,
      nextCursor: hasNextPage ? trends[trends.length - 1]._id : null,
      hasNextPage,
    };
  } catch (error) {
    console.log("error in product repo ", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------------------
export const getRandomProductsForCartPageRepository = async () => {
  try {
    const response = await productModel.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: 9 } },
      {
        $project: {
          name: 1,
          images: 1,
          mrp: 1,
          sellingPrice: 1,
          reviewCount: 1,
          unit: 1,
          quantityPerUnit: 1,
          rating: 1,
          marketPrice: 1,
          sku: 1,
          subcategoryId: 1,
        },
      },
    ]);
    return response ?? [];
  } catch (error) {
    console.log("error in product repo ", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------------------

export const searchProductRepository = async (query: SearchQuery) => {
  try {
    const {
      q,
      page = 1,
      limit = 10,
      minPrice,
      maxPrice,
      category,
      brand,
      sort = "relevance",
    } = query;

    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { isActive: true };

    if (q) {
      const regex = new RegExp(`^${q}`, "i");

      filter.$or = [{ name: regex }, { tag: regex }];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.sellingPrice = {};
      if (minPrice !== undefined) filter.sellingPrice.$gte = minPrice;
      if (maxPrice !== undefined) filter.sellingPrice.$lte = maxPrice;
    }

    if (category) filter.categoryId = category;
    if (brand) filter.brandId = brand;

    const sortOption: Record<string, any> = {};

    if (sort === "price_low") sortOption.sellingPrice = 1;
    if (sort === "price_high") sortOption.sellingPrice = -1;
    if (sort === "newest") sortOption.createdAt = -1;

    const products = await productModel
      .find(filter)
      .select({
        name: 1,
        mrp: 1,
        categoryId: 1,
        brandId: 1,
        images: 1,
        rating: 1,
      })
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await productModel.countDocuments(filter);

    return {
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      products,
    };
  } catch (error) {
    console.log("error in search repo", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------------------

export const getOrderDetailByuserIdRepository = async (
  userId: string,
  cursor?: string,
  limit: number = 8,
) => {
  try {
    let filter: any = { userId, status:"paid" };

    if (cursor) {
      filter._id = { $lt: new Types.ObjectId(cursor) };
    }

    const orders = await Order.find(filter)
      .populate({
        path: "items.productId",
        select: "images",
      })
      .sort({ _id: -1 })
      .limit(limit + 1);

    const hasMore = orders.length > limit;

    if (hasMore) orders.pop();

    const statusMap: any = {
      Delivered: (date: Date) =>
        `Delivered on ${new Date(date).toDateString()}`,
      Recieved: () => "Order placed successfully",
      packed: () => "Order packed",
      outForDelivery: () => "Out for delivery",
      packing: () => "Order in progress",
    };

    const formattedOrders = orders.map((order: any) => {
      const firstItem = order.items?.[0];

      return {
        id: order._id,
        title: firstItem?.name || "No Item",
        image:
          generateCloudFrontSignedUrl(firstItem?.productId?.images?.[0]) ||
          "https://via.placeholder.com/150",
        itemCount: order.items?.length || 0,
        subtitle: statusMap[order.orderStatus]?.(order.updatedAt) || "",
        totalAmount: order.totalAmount,
        status: order.orderStatus || order.status,
        canReview: order.orderStatus === "Delivered",
        rating: order.rating || 0,
        review: order.review || null,
      };
    });

    const nextCursor = hasMore ? orders[orders.length - 1]._id : null;

    return {
      data: formattedOrders,
      nextCursor,
      hasMore,
    };
  } catch (error) {
    console.log("error in order repo", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------------------------------------

export const getOrderDetailWithOrderIdRepository = async (orderId: string) => {
  try {
    const order = await Order.findById(orderId)
      .populate({
        path: "items.productId",
        select: "images",
      })
      .populate({
        path: "addressId",
      });

    if (!order) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "Order not found",
      };
    }

    const statusMap: any = {
      Delivered: (date: Date) =>
        `Delivered on ${new Date(date).toDateString()}`,
      Recieved: () => "Order placed successfully",
      packed: () => "Order packed",
      outForDelivery: () => "Out for delivery",
      packing: () => "Order in progress",
      cancelled: () => "Order cancelled",
    };

    const formattedOrder = {
      id: order._id,
      status: order.orderStatus,
      paymentStatus: order.status,
      totalAmount: order.totalAmount,
      address: {
        name: (order.addressId as any)?.name || "",
        phone: (order.addressId as any)?.phone || "",
        houseVillage: (order.addressId as any)?.houseVillage || "",
        areaStreet: (order.addressId as any)?.areaStreet || "",
        city: (order.addressId as any)?.city || "",
        type: (order.addressId as any)?.type || "",
        pincode: (order.addressId as any)?.pincode || "",
      },
      subtitle: statusMap[order.orderStatus]?.((order as any).updatedAt) || "",
      items: order.items.map((item: any) => ({
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image:
          generateCloudFrontSignedUrl(item.productId?.images?.[0]) ||
          "https://via.placeholder.com/150",
      })),
    };

    return formattedOrder;
  } catch (error) {
    console.log("error in order repo", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------------------------------

export const userRatingProductsServicesRepository = async (
  id: string,
  rating: number,
  review: string,
) => {
  try {
    const result = await Order.findByIdAndUpdate(id, {
      rating,
      review,
    });

    if (!result) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "Order not found",
      };
    }

    for (const item of result.items) {
      const product = await productModel.findById(item.productId);

      if (!product) continue;

      const oldRating = product.rating || 0;
      const oldCount = product.reviewCount || 0;

      const newCount = oldCount + 1;

      const newRating = (oldRating * oldCount + rating) / newCount;

      await productModel.findByIdAndUpdate(item.productId, {
        rating: newRating,
        reviewCount: newCount,
      });
    }

    result.orderStatus = "Rated";
    result.save();

    return {
      status: STATUS_CODE.OK,
      message: "Thanks for Rating",
    };
  } catch (error) {
    console.log("error in order repo", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------------------------------

export const shareAppFeedbackRepository = async (finalData: IFeedback) => {
  try {
    const feedbackTaken = await FeedBack.create(finalData);

    if (!feedbackTaken) {
      return {
        status: STATUS_CODE.BAD_REQUEST,
        message: "Error while Submiting Feedback",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Thanks for your Feedback !",
    };
  } catch (error) {
    console.log("error in order repo", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------------------------------

export const getPersonalInformationByUserIdRepository = async (
  userId: string,
) => {
  try {
    const userProfileData = await ShopProfileModel.findOne({
      userId,
    }).populate<{ userId: IUser }>({ path: "userId", select: "phone" });

    if (!userProfileData) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "User Profile Data bot found",
      };
    }

    const finalResult = {
      shopName: userProfileData.shopName,
      ownerName: userProfileData.ownerName,
      address: userProfileData.address,
      dateofbirth: userProfileData.dateofbirth,
      dateofRegister: userProfileData.createdAt,
      Type: userProfileData.Type,
      tenureOfShop: userProfileData.tenureOfShop,
      phone: userProfileData.userId.phone,
      documents:
        generateCloudFrontSignedUrl(userProfileData.documents.shopPhotos) ||
        "https://via.placeholder.com/150",
    };

    return finalResult;
  } catch (error) {
    console.log("error in order repo", error);
    throw error;
  }
};

//------------------------------------------------------------------------------------------------------------------------

export const emptyCartAfterCheckoutRepository = async (userId: string) => {
  try {
    const emptycart = await cartSchemaModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          items: [],
          subtotal: 0,
          totalItems: 0,
        },
      },
    );

    if (!emptycart) {
      return {
        status: STATUS_CODE.NOT_FOUND,
        message: "User cart Items not Found",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Cart Empty",
    };
  } catch (error) {
    console.log("error in order repo", error);
    throw error;
  }
};
