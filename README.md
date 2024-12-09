# GlowHub

An embeddable 3D scene for your GitHub profile

Illuminate the room with your GitHub profile and a dynamic timeline of your contributions.

<img src="https://github.com/user-attachments/assets/f3fe3e66-512d-4eb9-8e3e-2caab1abf674" width="50%" />

[Try it out](theglowhub.vercel.app)

## Change the theme (orange, purple, green)

with 

`/YOUR USERNAME?theme=purple`

## Take a screenshot

with `cmd + shift + s`, to save a shareable .png image

## Embedding in Your Website

You can embed your 3D GitHub profile in any website using an iframe. Here's how:

```html
<iframe 
  src="https://theglowhub.vercel.app/embed?username=YOUR_USERNAME&theme=orange"
  width="100%" 
  height="600px" 
  frameborder="0" 
  allowfullscreen
></iframe>
```

### Parameters

- `username`: Your GitHub username (required)
- `theme`: The theme for the timeline (default: 'green')

### Example

```html
<iframe 
  src="https://theglowhub.vercel.app/embed?username=thomscoder&theme=green"
  width="100%" 
  height="600px" 
  frameborder="0" 
  allowfullscreen
></iframe>
```
