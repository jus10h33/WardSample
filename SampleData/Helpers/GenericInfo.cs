using SampleData.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleData.Helpers
{
    public class GenericInfo
    {
        public List<SampleViewModel> Samples { get; set; }
        public List<AccountViewModel> Accounts { get; set; }
        public List<string> Messages { get; set; }
    }
}