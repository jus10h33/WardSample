using SampleData.Models;
using SampleData.ViewModels;
using System.Collections.Generic;

namespace SampleData.Helpers
{
    public class SampleInfoReturn
    {
        public List<SampleViewModel> Samples { get; set; }
        public List<AccountViewModel> Accounts { get; set; }                
    }
}