public with sharing class DocumentManagementController {

    @AuraEnabled(cacheable=true)
    public static List<Document__c> getAllDocuments(String queryTerm, String fieldName, String sortDirection){
        try{
            String whereClause = '';
            if(String.isNotBlank(queryTerm)){
                queryTerm = '%' + queryTerm + '%';
                whereClause = ' WHERE Name LIKE :queryTerm ';
            }
            String queryStr = 'SELECT Id, Name, Document_Category__c, Document_Version__c FROM Document__c';
            queryStr += whereClause;
            queryStr += ' ORDER BY ' + fieldName + ' ' + sortDirection;
            queryStr += ' LIMIT 50000 ';
            System.debug('queryStr ' + queryStr);
            return (List<Document__c>) Database.query(queryStr);
        }catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
}