import {
  Controller,
  Post,
  Delete,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Admin — Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload single image to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
          default: 'jubinlee/products',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp|gif|avif)$/i }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('folder') folder = 'jubinlee/products',
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    const safeFolder = folder.startsWith('jubinlee/') ? folder : `jubinlee/${folder}`;
    return this.cloudinaryService.uploadImage(file, safeFolder);
  }

  @Post('images')
  @ApiOperation({ summary: 'Upload multiple images to Cloudinary (up to 10)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder = 'jubinlee/products',
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No image files provided');
    }

    const safeFolder = folder.startsWith('jubinlee/') ? folder : `jubinlee/${folder}`;
    return this.cloudinaryService.uploadMultipleImages(files, safeFolder);
  }

  @Delete(':publicId')
  @ApiOperation({ summary: 'Delete image from Cloudinary by public ID' })
  async deleteImage(@Param('publicId') publicId: string) {
    return this.cloudinaryService.deleteImage(publicId);
  }
}
