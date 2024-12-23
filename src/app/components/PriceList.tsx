// src/app/components/PriceList.tsx

"use client";

// src/app/components/PriceList.tsx

import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Table from "./Table";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import Pagination from "./Pagination";
import PriceRow from "./PriceRow";
import { PriceData } from "../../types";

const ITEMS_PER_PAGE = 10;
const TOTAL_PAGES = 9;

const fetchPrices = async (page: number, search: string = ""): Promise<PriceData[]> => {
  const { data } = await axios.post("https://b.wallet.ir/coinlist/list", {
    page,
    limit: ITEMS_PER_PAGE,
    search,
    currency_code: "",
  });

  return data.items || [];
};

const PriceList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // تنظیم React Query برای دریافت داده‌ها به صورت Real-Time با refetchInterval
  const { data = [], isLoading } = useQuery({
    queryKey: ["prices", currentPage, searchTerm],
    queryFn: () => fetchPrices(currentPage, searchTerm),
    refetchInterval: 10000, // به‌روزرسانی هر ۱۰ ثانیه
  });

  const headers = [
    "فروش به والت",
    "خرید از والت",
    "تغییر روزانه",
    "ارزش دلاری",
    "نام رمز ارز",
  ];

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={6} className="text-center py-4">
            <div className="animate-pulse text-gray-400">در حال بارگذاری...</div>
          </td>
        </tr>
      );
    }

    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="text-center py-4">داده‌ای موجود نیست</td>
        </tr>
      );
    }

    return data.map((item) => <PriceRow key={item.id} item={item} />);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 rtl">
      <div className="container mx-auto">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 md:mb-8 mt-4">
          لیست قیمت لحظه‌ای ارزهای دیجیتال
        </h2>
        <CategoryFilter />
        <Table headers={headers} searchBar={<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}>
          {renderTableContent()}
        </Table>
        <Pagination currentPage={currentPage} totalPages={TOTAL_PAGES} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default PriceList;
