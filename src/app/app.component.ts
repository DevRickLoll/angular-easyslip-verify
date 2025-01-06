import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    file: File | null = null;
    isLoading = false;
    responseMessage: string | null = null;

    constructor(private http: HttpClient) {
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.file = input.files[0];
        }
    }

    uploadSlip(): void {
        if (!this.file) {
            alert('กรุณาเลือกไฟล์ก่อน!');
            return;
        }

        this.isLoading = true;
        this.responseMessage = null;

        const formData = new FormData();
        formData.append('file', this.file);

        this.http
            .post('https://developer.easyslip.com/api/v1/verify', formData, {
                headers: {
                    Authorization: `Bearer ${environment.EASYSLIP_API_TOKEN}`,
                },
            })
            .subscribe({
                next: (data) => {
                    this.responseMessage = JSON.stringify(data, null, 2);
                    alert('ยืนยันการอัปโหลดสำเร็จ!');
                },
                error: (error) => {
                    alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับ API');
                    console.error(error);
                },
                complete: () => {
                    this.isLoading = false;
                },
            });
    }
}
