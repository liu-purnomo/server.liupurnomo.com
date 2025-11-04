/**
 * Media Schemas
 * OpenAPI schema definitions for media library management
 */

export const mediaSchemas = {
  // ==================== REQUEST SCHEMAS ====================

  UploadMediaRequest: {
    type: 'object',
    required: ['file'],
    properties: {
      file: {
        type: 'string',
        format: 'binary',
        description: 'Media file to upload (images: JPEG/PNG/WebP/HEIC/GIF/SVG, videos: MP4/WebM/MOV, documents: PDF/Word/Excel)',
      },
      altText: {
        type: 'string',
        maxLength: 255,
        nullable: true,
        example: 'A beautiful sunset over the ocean',
        description: 'Alternative text for accessibility',
      },
      caption: {
        type: 'string',
        maxLength: 1000,
        nullable: true,
        example: 'Sunset at Bali beach, 2024',
        description: 'Media caption',
      },
    },
  },

  UpdateMediaRequest: {
    type: 'object',
    properties: {
      altText: {
        type: 'string',
        maxLength: 255,
        nullable: true,
        example: 'A beautiful sunset over the ocean',
        description: 'Alternative text for accessibility',
      },
      caption: {
        type: 'string',
        maxLength: 1000,
        nullable: true,
        example: 'Sunset at Bali beach, 2024',
        description: 'Media caption',
      },
    },
  },

  // ==================== RESPONSE SCHEMAS ====================

  MediaImageSizes: {
    type: 'object',
    properties: {
      original: {
        type: 'string',
        format: 'uri',
        example: 'https://api.example.com/uploads/media/abc123-original.webp',
        description: 'Original image URL',
      },
      large: {
        type: 'string',
        format: 'uri',
        example: 'https://api.example.com/uploads/media/abc123-large.webp',
        description: 'Large size (1920px) URL',
      },
      medium: {
        type: 'string',
        format: 'uri',
        example: 'https://api.example.com/uploads/media/abc123-medium.webp',
        description: 'Medium size (1280px) URL',
      },
      small: {
        type: 'string',
        format: 'uri',
        example: 'https://api.example.com/uploads/media/abc123-small.webp',
        description: 'Small size (640px) URL',
      },
      thumbnail: {
        type: 'string',
        format: 'uri',
        example: 'https://api.example.com/uploads/media/abc123-thumb.webp',
        description: 'Thumbnail (150px) URL',
      },
    },
  },

  MediaResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clxyz123abc456def',
        description: 'Media ID',
      },
      userId: {
        type: 'string',
        example: 'cluserid123456def',
        description: 'Uploader user ID',
      },
      fileName: {
        type: 'string',
        example: 'sunset-beach.jpg',
        description: 'Original filename',
      },
      filePath: {
        type: 'string',
        example: 'storages/media/abc123-original.webp',
        description: 'Server file path',
      },
      fileUrl: {
        type: 'string',
        format: 'uri',
        example: 'https://api.example.com/uploads/media/abc123-large.webp',
        description: 'Public URL (large size for images)',
      },
      mimeType: {
        type: 'string',
        example: 'image/jpeg',
        description: 'MIME type',
      },
      fileSize: {
        type: 'integer',
        example: 2048576,
        description: 'File size in bytes',
      },
      altText: {
        type: 'string',
        nullable: true,
        example: 'A beautiful sunset over the ocean',
        description: 'Alternative text for accessibility',
      },
      caption: {
        type: 'string',
        nullable: true,
        example: 'Sunset at Bali beach, 2024',
        description: 'Media caption',
      },
      width: {
        type: 'integer',
        nullable: true,
        example: 1920,
        description: 'Image/video width in pixels',
      },
      height: {
        type: 'integer',
        nullable: true,
        example: 1080,
        description: 'Image/video height in pixels',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
      },
      sizes: {
        $ref: '#/components/schemas/MediaImageSizes',
        description: 'Image size URLs (only for images)',
      },
      user: {
        type: 'object',
        nullable: true,
        properties: {
          id: {
            type: 'string',
            example: 'cluserid123456def',
          },
          name: {
            type: 'string',
            nullable: true,
            example: 'John Doe',
          },
          username: {
            type: 'string',
            nullable: true,
            example: 'johndoe',
          },
        },
      },
    },
  },

  MediaListItemResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clxyz123abc456def',
      },
      fileName: {
        type: 'string',
        example: 'sunset-beach.jpg',
      },
      fileUrl: {
        type: 'string',
        format: 'uri',
        example: 'https://api.example.com/uploads/media/abc123-large.webp',
      },
      mimeType: {
        type: 'string',
        example: 'image/jpeg',
      },
      fileSize: {
        type: 'integer',
        example: 2048576,
      },
      altText: {
        type: 'string',
        nullable: true,
        example: 'A beautiful sunset over the ocean',
      },
      width: {
        type: 'integer',
        nullable: true,
        example: 1920,
      },
      height: {
        type: 'integer',
        nullable: true,
        example: 1080,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
      },
      thumbnailUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://api.example.com/uploads/media/abc123-thumb.webp',
        description: 'Thumbnail URL (only for images)',
      },
    },
  },
};
