# Cricket Images

Upload your cricket images here. Recommended:

## How to Add Images:

1. Add your images to this folder (assets/cricket/)
2. Name them: `cricket-1.jpg`, `cricket-2.jpg`, `cricket-3.jpg`
3. Update `browse.html` to reference these images

## Recommended Image Specs:
- Size: 400x400px (square works best)
- Format: JPG or PNG
- Max size: 500KB per image

## To Update the HTML:

Find the `cricket-gallery` div in `browse.html` and replace the placeholder divs with:

```html
<img src="assets/cricket/cricket-1.jpg" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px;" alt="Cricket">
<img src="assets/cricket/cricket-2.jpg" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px;" alt="Cricket">
<img src="assets/cricket/cricket-3.jpg" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px;" alt="Cricket">
```
