import mongoose from "mongoose";
import { Location } from "./models/location";

function seedDB() {
    Location.remove({}, (err) => {
        if(err) {
            console.log(err);
        } else {
            console.log("Removed locations!");
        }
    });
}

Location.create()

export { seedDB };

