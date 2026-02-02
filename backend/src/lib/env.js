//global definition for env

import 'dotenv/config'

export const ENV={
PORT : process.env.PORT,
MONGO_URI : process.env.MONGO_URI,
NODE_ENV : process.env.NODE_ENV,
JWT_SECRET : process.env.JWT_SECRET,
RESEND_API_KEY : process.env.RESEND_API_KEY,
EMAIL_FROM : process.env.EMAIL_FROM,
EMAIL_FROM_NAME : process.env.EMAIL_FROM_NAME,
CLIENT_URL : process.env.CLIENT_URL,
CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> middleware
=======

>>>>>>> c821f5ae17e503c1732d709a1365a88e77f411d4
}

