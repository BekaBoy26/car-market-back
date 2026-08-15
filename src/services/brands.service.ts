import { pool } from "../plugins/pg";

export const getBrandsService = async () => {
  const result = await pool.query(
    `
            select id, name as brand from brands group by id, name order by id asc
        `,
  );

  return result.rows;
};
