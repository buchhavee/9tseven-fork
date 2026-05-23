export const GET_EVENT_POSTS = `
query GetEventPostsV2 {
  metaobjects(type: "eventcards", first: 5) {
    edges {
      node {
        id
        fields {
          key
          value
          reference {
            __typename
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
          references(first: 50) {
            edges {
              node {
                __typename
                ... on MediaImage {
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;
