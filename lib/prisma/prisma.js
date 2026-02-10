import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import environment from "@/config/environment";

const adapter = new PrismaMariaDb({
  host: environment.db_host,
  user: environment.db_user,
  password: environment.db_password,
  database: environment.db_database,
  connectionLimit: 5,
});
export const prisma = new PrismaClient({ adapter });
