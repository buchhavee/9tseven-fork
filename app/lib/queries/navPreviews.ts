export const GET_NAV_PREVIEWS = `
query GetNavPreviews($previewCount: Int!) {
  newArrivals: products(
    first: $previewCount
    sortKey: CREATED_AT
    reverse: true
    query: "tag:'new-arrival'"
  ) {
    edges {
      node {
        handle
        title
        productType
        featuredImage {
          url
          altText
        }
      }
    }
  }
  performance: products(
    first: $previewCount
    sortKey: CREATED_AT
    reverse: true
    query: "product_type:'Performance'"
  ) {
    edges {
      node {
        handle
        title
        productType
        featuredImage {
          url
          altText
        }
      }
    }
  }
  lifestyle: products(
    first: $previewCount
    sortKey: CREATED_AT
    reverse: true
    query: "product_type:'Lifestyle'"
  ) {
    edges {
      node {
        handle
        title
        productType
        featuredImage {
          url
          altText
        }
      }
    }
  }
  accessories: products(
    first: $previewCount
    sortKey: CREATED_AT
    reverse: true
    query: "product_type:'Accessories' OR product_type:'Equipment'"
  ) {
    edges {
      node {
        handle
        title
        productType
        featuredImage {
          url
          altText
        }
      }
    }
  }
  allProducts: products(first: $previewCount) {
    edges {
      node {
        handle
        title
        productType
        featuredImage {
          url
          altText
        }
      }
    }
  }
}
`;
