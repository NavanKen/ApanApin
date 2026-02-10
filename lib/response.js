import { NextResponse } from "next/server";

const response = {
  success(data, message, status = 200) {
    return NextResponse.json({ success: true, message, data }, { status });
  },

  pagination(data, pagination, message, status = 200) {
    return NextResponse.json(
      {
        meta: {
          success: true,
          message,
        },
        data,
        pagination,
      },
      { status },
    );
  },

  created(data, message) {
    return this.success(data, message, 201);
  },
  error(message, status = 400) {
    return NextResponse.json({ success: false, error: message }, { status });
  },
  notFound(message = "Data Tidak Ditemukan") {
    return this.error(message, 404);
  },
  unauthorized(message = "Silahkan Login Terlebih Dahulu") {
    return this.error(message, 401);
  },
  forbidden(message = "Anda Tidak Memiliki Akses") {
    return this.error(message, 403);
  },
  validationError(errors = "Data Tidak Valid") {
    if (Array.isArray(errors)) {
      return NextResponse.json({ success: false, errors }, { status: 422 });
    }
    return this.error(errors, 422);
  },
  serverError(message = "Internal Server Error") {
    return this.error(message, 500);
  },
};

export default response;
