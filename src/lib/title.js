/**
 * @param {string?} page
 */
export default function setDocumentTitle(page) {
  const dev = import.meta.env.DEV;
  const title = (dev ? '(DEV) ' : '') + 'doit' + (page ? ' | ' + page : '');

  document.title = title;

  return title;
}