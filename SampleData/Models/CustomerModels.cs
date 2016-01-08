using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace SampleData.Models
{
    public class CustomerModels
    {
        [Key]
        [Required]
        public int CustomerNumber { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Company { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Country { get; set; }
        public int BillToCompany { get; set; }
        public double Discount { get; set; }
        public int ActiveCustomer { get; set; }
        public int Mailresults { get; set; }
        public int MailedCopies { get; set; }
        public int FaxResults { get; set; }
        public int EmailResults { get; set; }
        public int PostResultsToWeb { get; set; }
        public int Newsletter { get; set; }
        public int WardGuide { get; set; }
        public int ChristmasCard { get; set; }
        public int NamaCust { get; set; }
        public int SendPDF { get; set; }
        public int PrintPDFHeaderFooter { get; set; }
        public int EPAInfo { get; set; }
        public int PrintInvNow { get; set; }
        public int PrintInvLater { get; set; }
        public int SendInvoice { get; set; }
        public int SendTextData { get; set; }
        public int SplitGrowers { get; set; }
        public int SplitFields { get; set; }
        public string ExtraInformation { get; set; }
        public int CustomerStatus { get; set; }
        public DateTime LastModified { get; set; }
        public string MachineID { get; set; }
        public string UserID { get; set; }
        public string SampleEntryInformation { get; set; }
        public DateTime CreatedOn { get; set; }
        public int ForceStandardSoilReport { get; set; }
    }
}