import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pageCount, currentPage, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={(item) => onPageChange(item.selected + 1)}
      previousLabel={"‹"}
      nextLabel={"›"}
      containerClassName={styles.pagination}
      pageClassName={styles.page}
      activeClassName={styles.active}
      previousClassName={styles.prev}
      nextClassName={styles.next}
      breakLabel={"..."}
      breakClassName={styles.break}
    />
  );
}
