import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';

import getAllDocuments from '@salesforce/apex/DocumentManagementController.getAllDocuments';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const actions = [
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' },
];

const columns = [{
        label: 'Name', 
        fieldName: 'Name' ,
        sortable: true,
    },{
        label: 'Document Version',
        fieldName: 'Document_Version__c',
        type: 'number',
        sortable: true,
        cellAttributes: { alignment: 'left' },
    },{ 
        label: 'Document Category', 
        fieldName: 'Document_Category__c',
        sortable: true,
    },{
        type: 'action',
        typeAttributes: { rowActions: actions },
    }
];
export default class DocumentManagement extends LightningElement {

    @track documentList;
    @track columns = columns;
    @track error;
    @track editMode = false;
    @track selectedRow;

    @track sortDirection = 'desc';
    @track sortedBy = 'CreatedDate';
    @track queryTerm = ''; 
    
    @track tempDocumentList;
    @wire(getAllDocuments, { queryTerm : '$queryTerm', fieldName: '$sortedBy', sortDirection: '$sortDirection'})
    wiredDocuments(value) {
        this.tempDocumentList = value;
        const { error, data } = value;
        if (data) {
            this.documentList = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.documentList = undefined;
        }
    }
  
    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
  
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const selectedRow = event.detail.row;

        switch (actionName) {
            case 'delete':
                this.deleteRow(selectedRow.Id);
                break;
            case 'edit':
                this.editDetail(selectedRow);
                break;
            default:
        }
    }

    deleteRow(selectedId) {
        console.log('selectedId', selectedId);
        deleteRecord(selectedId)
            .then(() => {
                this.showToast('Success', 'Record deleted', 'success');
                refreshApex(this.tempDocumentList);
            })
            .catch(error => {
                this.showToast('Error deleting record', error.body.message, 'error');
            });
    }

    editDetail(selectedRow) {
        console.log('selectedId', selectedRow);
        this.selectedRow = selectedRow;
        this.editMode = true;
    }

    handleCancel(){
        this.editMode = false;
    }

    handleSuccess(){
        refreshApex(this.tempDocumentList);
        this.handleCancel();
        this.showToast('Success', 'Record Updated', 'success');
    }

    handleInputChange(event){
        let tempQueryTerm = event.target.value;
        if(tempQueryTerm.length > 2){
            this.queryTerm = tempQueryTerm;
        }else{
            this.queryTerm = '';
        }
    }

    showToast(title, message, variant){
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
                mode: 'dismissable'
            })
        );
    }

}