import { IUnitInterface } from "../../types/Dashboardtypes";
import {
  addBrandRepository,
  addUnitRepository,
  editBrandRepository,
  editUnitRepository,
  getBrandsForFormsRepository,
  getUnitRepository,
  getUnitFordashboardRepository
} from "../Repository/BrandAndUnit.repository";
//-------------------------------------------------------------------------------

export const addBrandServices = async (name: string, description: string) => {
  try {
    const response = await addBrandRepository(name, description);
    return response;
  } catch (error) {
    console.log("error in brand and unit section ", error);
    throw error;
  }
};

//----------------------------------------------------------------------------

export const addUnitServices = async (data: IUnitInterface) => {
  try {
    const response = await addUnitRepository(data);
    return response;
  } catch (error) {
    console.log("error in brand and unit section ", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------

export const editBrandServices = async (
  _id: string,
  name: string,
  description: string
) => {
  try {
    const response = await editBrandRepository(_id, name, description);
    return response;
  } catch (error) {
    console.log("error in brand and unit section ", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------

export const editUnitServices = async (data: IUnitInterface) => {
  try {
    const response = await editUnitRepository(data);
    return response;
  } catch (error) {
    console.log("error in brand and unit section ", error);
    throw error;
  }
};

//-------------------------------------------------------------------------------

export const getBrandsForFormsServices = async () => {
  try {
    const response = await getBrandsForFormsRepository();
    return response;
  } catch (error) {
    console.log("error in brand and unit section ", error);
    throw error;
  }
};
//-------------------------------------------------------------------------------

export const getUnitServices = async () => {
  try {
    const response = await getUnitRepository();
    return response;
  } catch (error) {
    console.log("error in brand and unit section ", error);
    throw error;
  }
};

//--------------------------------------------------------------------------------

export const getUnitFordashboardServices = async () => {
  try {
    const response = await getUnitFordashboardRepository();
    return response;
  } catch (error) {
    console.log("error in brand and unit section ", error);
    throw error;
  }
}
