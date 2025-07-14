import { useLocation } from "react-router-dom";

export function usePage() {
  const { pathname } = useLocation();

  function isCurrentPage(link) {
    return link === pathname;
  }

  return { isCurrentPage };
}