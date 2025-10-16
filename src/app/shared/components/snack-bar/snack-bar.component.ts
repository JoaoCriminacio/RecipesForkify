import {Component, OnInit} from '@angular/core';
import {SnackBarService} from '../../services/snack-bar.service';
import {ISnackBar} from '../../models/snack-bar.model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-snack-bar',
  imports: [
    NgClass
  ],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.css'
})
export class SnackBarComponent implements OnInit {
    protected message: string = '';
    protected type: 'success' | 'error' | 'warning' = 'success';
    protected visible: boolean = false;

    constructor(private snackBarService: SnackBarService) {}

    ngOnInit() {
      this.snackBarService.snackBar$.subscribe((data: ISnackBar) => {
        this.message = data.message;
        this.type = data.type;
        this.visible = true;

        setTimeout(() => (this.visible = false), 3000);
      });
    }
}
