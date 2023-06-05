import * as Joi from 'joi';
import {
  CreateCommentDto,
  UpdateCommentDto,
} from 'src/comments/dto/Comment.dto';

// comment validation
export const validateCreateComment = (
  body: CreateCommentDto,
): Joi.ValidationResult<CreateCommentDto> => {
  const schema = Joi.object({
    comment: Joi.string().trim().lowercase().required(),
    created_at: Joi.date().timestamp().default(new Date()),
  });

  return schema.validate(body);
};

export const validateUpdateComment = (
  body: UpdateCommentDto,
): Joi.ValidationResult<UpdateCommentDto> => {
  const schema = Joi.object({
    comment: Joi.string().trim().lowercase(),
    updated_at: Joi.date().timestamp().default(new Date()),
  });

  return schema.validate(body);
};
