import { STATES } from "mongoose";
import { BrandModel } from "../Modals/Brand.modal";
import { STATUS_CODE } from "../../Api";
import { IUnitInterface } from "../../types/Dashboardtypes";
import { UnitModal } from "../Modals/Unit.modal";

//-----------------------------------------------------------------------------------------------------

export const addBrandRepository = async (name: string, description: string) => {
  try {
    const response = await BrandModel.create({
      name,
      description,
    });

    if (!response) {
      return {
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        message: "error while creating brand",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Brand Created Successfully",
    };
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------

export const addUnitRepository = async (data: IUnitInterface) => {
  try {
    const response = await UnitModal.create(data);

    if (!response) {
      return {
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        message: "error while creating Unit",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Unit Created Successfully",
    };
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------

export const editBrandRepository = async (
  _id: string,
  name: string,
  description: string
) => {
  try {
    const response = await BrandModel.findByIdAndUpdate(_id, {
      $set: {
        name,
        description,
      },
    });

    if (!response) {
      return {
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        message: "error while updating brand",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Brand Updated Successfully",
    };
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//----------------------------------------------------------------------------------------------
export const editUnitRepository = async (data: IUnitInterface) => {
  try {
    const response = await UnitModal.findByIdAndUpdate(data._id, {
      $set: {
        name: data.name,
        shortName: data.shortName,
        baseUnit: data.baseUnit,
        multiplier: data.multiplier,
      },
    });
    if (!response) {
      return {
        status: STATUS_CODE.INTERNAL_SERVER_ERROR,
        message: "error while updating Unit",
      };
    }

    return {
      status: STATUS_CODE.OK,
      message: "Unit Updated Successfully",
    };
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------------

export const getBrandsForFormsRepository = async () => {
  try {
    const getBrands = await BrandModel.find({ isActive: true }).select("name");
    if (!getBrands) {
      return [];
    }
    return getBrands;
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};

//---------------------------------------------------------------------------------------

export const getUnitRepository = async () => {
  try {
    const getUnit = await UnitModal.find({ isActive: true }).select("name");
    if (!getUnit) {
      return [];
    }
    return getUnit;
  } catch (error) {
    console.log("error in brand and unit repository", error);
    throw error;
  }
};
