using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleData.ViewModels
{
    public class InvoiceViewModel
    {
        public int InvoiceNumber { get; set; }
        public int AccountNumber { get; set; }
        public int SampleTypeNumber { get; set; }
        public int BatchNumber { get; set; }
        public DateTime DateReported { get; set; }
    }
}