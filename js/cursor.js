class Cursor
{
  constructor(target, hovers=[], smoothing=0.15)
  {
    this.target = target;
    this.hovers = Object.values(hovers).map(hover => hover.className);
    
    this.cursor = {
      previous: {
        x: null,
        y: null,
      },
      position: {
        x: null,
        y: null,
      },
      scale: 1,
      scaleTo: 1,
    }
    
    this.smoothing = smoothing;
    window.addEventListener("mousemove", e => this.move(e));
    window.requestAnimationFrame(() => this.render());
  }
  
  lerp(start, stop, amt)
  {
    return (1-amt)*start+amt*stop;
  }
  
  move(e)
  {
    // Lerp to Positions
    this.target.style.opacity = 1;
    [this.cursor.position.x, this.cursor.position.y] = [e.clientX, e.clientY];

    if(this.hovers.includes(e.target.className))
      this.cursor.scaleTo = e.target.dataset?.cursorScale || 12;
    else
      this.cursor.scaleTo = 1;

    window.removeEventListener("mousemove", this.move);
  
  }
  render()
  {
    this.cursor.previous.x = this.lerp(
      this.cursor.previous.x,
      this.cursor.position.x,
      this.smoothing,
    )

    this.cursor.previous.y = this.lerp(
      this.cursor.previous.y,
      this.cursor.position.y,
      this.smoothing,
    )
    
    this.cursor.scale = this.lerp(
      this.cursor.scale,
      this.cursor.scaleTo,
      0.24,
    );
    
   
    this.target.style.transform = `scale(${this.cursor.scale}) translate(${this.cursor.previous.x * (1/this.cursor.scale)}px, ${this.cursor.previous.y * (1/this.cursor.scale)}px)`
    requestAnimationFrame(() => this.render())
  }
}