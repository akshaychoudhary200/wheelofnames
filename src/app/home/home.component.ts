import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForOf} from '@angular/common';
import anime from 'animejs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit{
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private segmentAngle!: number;
  private currentAngle = 0;
  private colors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0', '#66b3ff']; // Color options


  names: string[] = ["a", "b", "c", "d", "e"];
  selectedName: string | undefined;

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    // segment angle 5 elements in array so 5 equal segments
    this.segmentAngle = 2 * Math.PI / this.names.length;
    this.drawWheel();
    this.drawPointer();
  }

  drawWheel() {
    const radius = this.canvasRef.nativeElement.width / 2;
    this.names.forEach((name, index) => {
      const angle = this.segmentAngle * index;
      this.drawSegment(angle, name, radius, index);
    });
  }

  drawPointer() {
    const canvasSize = this.canvasRef.nativeElement.width;
    this.ctx.beginPath();
    this.ctx.moveTo(canvasSize / 2 - 10, 10); // Left point of the triangle
    this.ctx.lineTo(canvasSize / 2 + 10, 10); // Right point of the triangle
    this.ctx.lineTo(canvasSize / 2, 30);      // Bottom point of the triangle
    this.ctx.closePath();
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
  }


  drawSegment(startAngle: number, name: string, radius: number, index: number) {
    const endAngle = startAngle + this.segmentAngle;
    this.ctx.beginPath();
    this.ctx.moveTo(radius, radius);
    this.ctx.arc(radius, radius, radius, startAngle, endAngle);
    this.ctx.fillStyle = this.colors[index % this.colors.length];
    this.ctx.fill();
    this.ctx.stroke();

    // Add text to the segment
    this.ctx.save();
    this.ctx.translate(radius, radius);
    this.ctx.rotate(startAngle + this.segmentAngle / 2);
    this.ctx.fillStyle = 'black';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(name, radius / 2, 0);
    this.ctx.restore();
  }


  shuffleNames() {
    for (let i = this.names.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.names[i], this.names[j]] = [this.names[j], this.names[i]];
    }
    this.updateWheel();
    console.log(this.names);
  }


  spinWheel() {
    const spin = anime({
      targets: this,
      currentAngle: this.currentAngle + 1440 + Math.random() * 360, // Spin angle
      easing: 'easeOutQuart',  // Slows down smoothly
      duration: 5000,          // 5-second spin
      update: () => this.updateWheel(),  // Redraw wheel on each frame
      complete: () => this.showWinner()  // Display winner at end
    });
  }

  private updateWheel() {
    const canvasSize = this.canvasRef.nativeElement.width;
    this.ctx.clearRect(0, 0, canvasSize, canvasSize);
    this.ctx.save();
    this.ctx.translate(canvasSize / 2, canvasSize / 2);
    this.ctx.rotate((this.currentAngle * Math.PI) / 180);
    this.ctx.translate(-canvasSize / 2, -canvasSize / 2);
    this.drawWheel();
    this.ctx.restore();
    this.drawPointer();
  }

  showWinner() {
    const winningIndex = Math.floor(((this.currentAngle % 360) / 360) * this.names.length);
    alert(`The winner is ${this.names[winningIndex]}!`);
  }

}
