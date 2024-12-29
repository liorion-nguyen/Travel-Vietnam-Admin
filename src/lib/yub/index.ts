import * as Yup from 'yup';

import { Status } from '@/types/roles';
import { RoomType } from '@/types/rooms';

export const validationRoom = Yup.object().shape({
  roomNumber: Yup.number()
    .required('Room Number is required.')
    .min(1, 'Room Number must be at least 1.'),

  price: Yup.number()
    .required('Price is required.')
    .min(1, 'Price must be at least 1.')
    .max(1000000000, 'Price cannot exceed 1000000000.'),

  roomType: Yup.mixed().oneOf(Object.values(RoomType), 'Invalid room type.').required('Room type is required.'),

  description: Yup.string()
    .required('Description is required.')
    .min(10, 'Description must be at least 10 characters long.')
    .max(1000, 'Description cannot exceed 1000 characters.'),

  maxOccupancy: Yup.number()
    .required('Max Occupancy is required.')
    .min(1, 'Max Occupancy must be at least 1.')
    .max(10, 'Max Occupancy cannot exceed 10.'),

  status: Yup.boolean().required('Status is required.'),

  hotelName: Yup.string()
    .required('Hotel Name is required.')
    .min(3, 'Hotel Name must be at least 3 characters long.')
    .max(100, 'Hotel Name cannot exceed 100 characters.'),
});

export const validationBooking = Yup.object().shape({
  userId: Yup.string()
    .required('User ID is required.')
    .matches(/^[0-9a-fA-F]{24}$/, 'User ID must be a valid MongoDB ObjectId.'),

  orderId: Yup.string()
    .required('Order ID is required.')
    .min(3, 'Order ID must be at least 3 characters long.')
    .max(100, 'Order ID cannot exceed 100 characters.'),

  amount: Yup.number()
    .required('Amount is required.')
    .min(1, 'Amount must be at least 1.')
    .max(1000000000, 'Amount cannot exceed 1000000000.'),

  vnpayCode: Yup.string()
    .required('Vnpay Code is required.')
    .typeError('Vnpay Code must be a numeric value.'),

  status: Yup.mixed().oneOf(Object.values(Status), 'Invalid status.').required('Status is required.'),
});

export const validationDiscount = Yup.object().shape({
  code: Yup.string()
    .required('Code is required.')
    .min(3, 'Code must be at least 3 characters long.')
    .max(100, 'Code cannot exceed 100 characters.'),

  description: Yup.string()
    .required('Description is required.')
    .min(10, 'Description must be at least 10 characters long.')
    .max(1000, 'Description cannot exceed 1000 characters.'),

  value: Yup.number()
    .required('Value is required.')
    .typeError('Value must be a numeric value.')
    .positive('Value must be a positive number.'),

  min_order_value: Yup.number()
    .optional()
    .typeError('Min order value must be a numeric value.')
    .positive('Min order value must be a positive number.'),

  max_discount_value: Yup.number()
    .optional()
    .typeError('Max discount value must be a numeric value.')
    .positive('Max discount value must be a positive number.'),

  startDate: Yup.date()
    .required('Start Date is required.')
    .typeError('Start Date must be a valid date.'),

  endDate: Yup.date()
    .required('End Date is required.')
    .typeError('End Date must be a valid date.')
    .min(Yup.ref('startDate'), 'End Date must be after Start Date.'),
});

export const validationHotel = Yup.object().shape({
  files: Yup.array().required('At least one image is required.').min(1, 'At least one image is required.'),
  name: Yup.string()
    .required('Title is required.')
    .min(3, 'Title must be at least 3 characters long.')
    .max(100, 'Title cannot exceed 100 characters.'),

  description: Yup.string()
    .required('Description is required.')
    .min(10, 'Description must be at least 10 characters long.')
    .max(1000, 'Description cannot exceed 1000 characters.'),

  price: Yup.number()
    .required('Price is required.')
    .typeError('Price must be a numeric value.')
    .positive('Price must be a positive number.'),

  startDate: Yup.date().required('Start Date is required.').typeError('Start Date must be a valid date.'),

  endDate: Yup.date()
    .required('End Date is required.')
    .typeError('End Date must be a valid date.')
    .min(Yup.ref('startDate'), 'End Date must be after Start Date.'),

  address: Yup.object().shape({
    province: Yup.string().required('Province is required.'),
    district: Yup.string().required('District is required.'),
    ward: Yup.string().required('Ward is required.'),
  }),
});


export const validationTour = Yup.object().shape({
  files: Yup.array().required('At least one image is required.').min(1, 'At least one image is required.'),
  title: Yup.string()
    .required('Title is required.')
    .min(3, 'Title must be at least 3 characters long.')
    .max(100, 'Title cannot exceed 100 characters.'),

  desc: Yup.string()
    .required('Description is required.')
    .min(10, 'Description must be at least 10 characters long.')
    .max(1000, 'Description cannot exceed 1000 characters.'),

  price: Yup.number()
    .required('Price is required.')
    .typeError('Price must be a numeric value.')
    .positive('Price must be a positive number.'),

  maxGroupSize: Yup.number()
    .required('Max Group Size is required.')
    .min(1, 'Max Group Size must be at least 1.')
    .max(50, 'Max Group Size cannot exceed 50.'),

  hotelId: Yup.string()
    .required('Hotel ID is required.')
    .matches(/^[0-9a-fA-F]{24}$/, 'Hotel ID must be a valid MongoDB ObjectId.'),

  startDate: Yup.date().required('Start Date is required.').typeError('Start Date must be a valid date.'),

  endDate: Yup.date()
    .required('End Date is required.')
    .typeError('End Date must be a valid date.')
    .min(Yup.ref('startDate'), 'End Date must be after Start Date.'),

  destination: Yup.object().shape({
    province: Yup.string().required('Province is required.'),
    district: Yup.string().required('District is required.'),
    ward: Yup.string().required('Ward is required.'),
  }),

  departurePoint: Yup.object().shape({
    province: Yup.string().required('Province is required.'),
    district: Yup.string().required('District is required.'),
    ward: Yup.string().required('Ward is required.'),
  }),
});

export const validationRoles = Yup.object().shape({
  name: Yup.string()
    .required('Name is required.')
    .min(3, 'Name must be at least 3 characters long.')
    .max(100, 'Name cannot exceed 100 characters.'),

  description: Yup.string()
    .optional() // Because description is marked as optional in the class.
    .min(10, 'Description must be at least 10 characters long.')
    .max(1000, 'Description cannot exceed 1000 characters.'),

  permissions: Yup.array().of(Yup.string().required('Permission is required.')).required('Permissions are required.'),

  status: Yup.mixed().oneOf(Object.values(Status), 'Invalid status.').required('Status is required.'),
});
