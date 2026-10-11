import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    
    try {
      const body = new URLSearchParams();
      body.append('key', '76ffca68cd9c73caf76e6515c27a27b5');
      body.append('image', file.buffer.toString('base64'));

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: body,
      });

      const result = await response.json();

      if (result.success) {
        return {
          message: 'Image uploaded successfully',
          url: result.data.url,
          filename: file.originalname,
        };
      } else {
        throw new BadRequestException('Image upload to ImgBB failed');
      }
    } catch (error: any) {
      throw new BadRequestException('Image upload failed: ' + error.message);
    }
  }
}
