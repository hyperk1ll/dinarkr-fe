import React, { ReactNode } from "react";

interface CardProdukProps {
  children: ReactNode;
}

const CardProduk: React.FC<CardProdukProps> = ({
  children,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
      </div>
    </div>
  );
};

export default CardProduk;
