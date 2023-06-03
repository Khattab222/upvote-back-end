import { systemRoles } from "../../utils/systemRoles.js";

export const endPoints = {
    GET_ALL_USER :[systemRoles.ADMIN],
    DELETE_USER :[systemRoles.ADMIN,systemRoles.USER],
}