// utils/setAllMetaTags.js
export const setAllMetaTags = (product) => {
  if (!product) return;
  // console.log("product", product);
  // console.log("document title", document.head);
  const setMetaTag = (name, content, attr = "name") => {
    if (!content) return;
    let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(attr, name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };
  const imageUrl = product.ProductThumbnail?.startsWith("http")
    ? product.ProductThumbnail
    : `${window.location.origin}${product.ProductThumbnail}`;
  const title = product.SEOTitle || product.ProductName;
  const description = product.SEODescription || product.Description;
  const keywords = product.SEOKey || product.SearchKeyword;
  // Basic SEO
  document.title = title;
  setMetaTag("description", description);
  setMetaTag("keywords", keywords);
  // Open Graph
  setMetaTag("og:title", title, "property");
  setMetaTag("og:description", description, "property");
  setMetaTag("og:image", imageUrl, "property");
  setMetaTag("og:url", window.location.href, "property");
  setMetaTag("og:type", "product", "property");
};
