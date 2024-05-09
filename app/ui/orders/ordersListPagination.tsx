'use client';
import React, { useEffect, useState } from 'react';
import {
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  router: any;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  // Function to determine which pages to show in the pagination
  const paginationItems = () => {
    let items = [];
    if (currentPage > 1) {
      // Previous Page
      items.push(
        <PaginationPrevious
          key="prev"
          className="mr-[20px]"
          href="#"
          onClick={() => onPageChange(currentPage - 1)}
        />,
      );
    }

    function generateRandomNumber(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //Current page

    items.push(
      <div className="flex justify-between" key={generateRandomNumber(1, 100)}>
        <PaginationLink className=" bg-gray-200" aria-current="page">
          {currentPage}
        </PaginationLink>

        <PaginationItem key={currentPage + 1}>
          <PaginationLink aria-current="page">{currentPage + 1}</PaginationLink>
        </PaginationItem>
        <PaginationItem key={currentPage + 2}>
          <PaginationLink aria-current="page">{currentPage + 2}</PaginationLink>
        </PaginationItem>
      </div>,
    );

    if (currentPage < totalPages) {
      // Next Page
      items.push(
        <PaginationNext
          key="next"
          href="#"
          onClick={() => onPageChange(currentPage + 1)}
        />,
      );
    }

    // if (totalPages > 1 && currentPage !== totalPages) {
    //   // Last Page
    //   items.push(
    //     <PaginationItem key={totalPages}>
    //       <PaginationLink onClick={() => onPageChange(totalPages)}>
    //         Last
    //       </PaginationLink>
    //     </PaginationItem>,
    //   );
    // }

    return items;
  };

  return <div className="flex space-x-1">{paginationItems()}</div>;
}
