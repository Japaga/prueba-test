import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent],
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor() {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

  @ViewChild('card', { static: true })
  card!: ElementRef;

  // suavizado (clave estilo Steam)
  currentX = 0;
  currentY = 0;

  targetX = 0;
  targetY = 0;

  animationFrame: any;

  onMouseMove(event: MouseEvent) {

    const el = this.card.nativeElement;
    const rect = el.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // normalizamos posición (-0.5 a 0.5)
    this.targetX = (x / rect.width) - 0.5;
    this.targetY = (y / rect.height) - 0.5;

    this.animate();
  }

  animate() {

    const el = this.card.nativeElement;

    // suavizado tipo Steam (LERP)
    this.currentX += (this.targetX - this.currentX) * 0.1;
    this.currentY += (this.targetY - this.currentY) * 0.1;

    const rotateY = this.currentX * 25;
    const rotateX = this.currentY * -25;

    el.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.05)
    `;

    // brillo dinámico
    const shine = el.querySelector('.shine') as HTMLElement;

    if (shine) {
      shine.style.left = `${(this.currentX + 0.5) * 100}%`;
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  onMouseLeave() {

    const el = this.card.nativeElement;

    cancelAnimationFrame(this.animationFrame);

    el.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  }


}
