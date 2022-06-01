import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { DataService } from '../service/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-edit',
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.scss'],
})
export class FormEditComponent implements OnInit {
  @ViewChild('editForm') editForm: FormGroupDirective;

  constructor(
    private modalController: ModalController,
    private dataService: DataService
    ) { }

    @Input() id: any;

    editContactsForm: FormGroup;
    subscribe1: Subscription;
    subscribe2: Subscription;
    contact: any;
    isEdited = false;

  ngOnInit() {
    this.subscribe1 = this.dataService.getContactsById(this.id).subscribe(contact => {
      if (!contact) {
        this.close();
      }else{
        this.contact = contact;
        this.editContactsForm = new FormGroup({
          'name': new FormControl(this.contact.name, Validators.required),
          'lastname': new FormControl(this.contact.lastname, Validators.required),
          'email': new FormControl(this.contact.email, Validators.required),
          'mobile': new FormControl(this.contact.mobile, Validators.required)
        });

        this.subscribe2 = this.editContactsForm.valueChanges.subscribe(values => {
          this.isEdited = true;
        });
      }
    });
  }

  submitForm(){
    this.editForm.onSubmit(undefined);
  }

  editContact(value: any) {
    let editedContact = {id: this.contact.id, ...value};
    this.dataService.editContact(editedContact).then(res => this.close);
  }

  close(){
    this.modalController.dismiss();
  }

}
