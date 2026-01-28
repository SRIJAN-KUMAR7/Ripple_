import {v2 as cloudinary} from "cloudinary";
import { ENV } from "./env";

cloudinary.config({
    cloud_name:ENV.cloudin
})

