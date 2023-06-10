@IsTest
private class DocumentManagementControllerTest {

    @TestSetup
    private static void testDataSetup(){
        List<Document__c> documentList = new List<Document__c>();

        documentList.add(new Document__c(
            Name = 'Doc 1',
            Document_Category__c = 'Finance',
            Document_Version__c = 2
        ));

        documentList.add(new Document__c(
            Name = 'Doc 2',
            Document_Category__c = 'Interview',
            Document_Version__c = 1
        ));

        INSERT documentList;
    }

    @IsTest
    private static void testGetAllDocument(){
        List<Document__c> documentList = DocumentManagementController.getAllDocuments('', 'CreatedDate', 'desc');
        System.assert(documentList.size() == 2);
    }

    @IsTest
    private static void testGetFilteredDocument(){
        List<Document__c> documentList = DocumentManagementController.getAllDocuments('Doc 2', 'CreatedDate', 'desc');
        System.assert(documentList.size() == 1);
    }

    @IsTest
    private static void testException(){
        try{
            List<Document__c> documentList = DocumentManagementController.getAllDocuments('Doc 2', '', 'desc');
            System.assert(documentList.size() == 0);
        }catch(Exception e){}
        
    }
}