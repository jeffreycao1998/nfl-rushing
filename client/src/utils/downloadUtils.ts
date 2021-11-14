export function downloadBlob(blob: Blob, filename: string) {
  // Create an object URL for the blob object
  const url = URL.createObjectURL(blob);

  // Create a new anchor element
  const a = document.createElement('a');

  // Set the href and download attributes for the anchor element
  // You can optionally set other attributes like `title`, etc
  // Especially, if the anchor element will be attached to the DOM
  a.href = url;
  a.download = filename || 'download';

  // Click handler that releases the object URL after the element has been clicked
  // This is required for one-off downloads of the blob content
  const clickHandler = function() {
    setTimeout(() => {
      // Release the object URL
      URL.revokeObjectURL(url);
      
      // Remove the event listener from the anchor element
      a.removeEventListener('click', clickHandler);
      
      // Remove the anchor element from the DOM
      (a.remove && (a.remove(), 1)) ||
      (a.parentNode && a.parentNode.removeChild(a));
    }, 150);
  };

  return a;
}
