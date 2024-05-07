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
        <PaginationLink
          className="mr-[20px]"
          onClick={() => onPageChange(currentPage - 1)}
        >
          <PaginationPrevious href="#" />
        </PaginationLink>,
      );
    }

    // Current page
    items.push(
      <>
        <PaginationLink className="ml-[40px] bg-gray-200" aria-current="page">
          {currentPage}
        </PaginationLink>

        <PaginationItem key={currentPage + 1}>
          <PaginationLink aria-current="page">{currentPage + 1}</PaginationLink>
        </PaginationItem>
        <PaginationItem key={currentPage + 2}>
          <PaginationLink aria-current="page">{currentPage + 2}</PaginationLink>
        </PaginationItem>
      </>,
    );

    if (currentPage < totalPages) {
      // Next Page
      items.push(
        <PaginationItem key="next">
          <PaginationLink onClick={() => onPageChange(currentPage + 1)}>
            <PaginationNext href="#" />
          </PaginationLink>
        </PaginationItem>,
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
