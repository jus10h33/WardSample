using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleData.ViewModels
{
    public class AccountViewModel
    {
        public string Name { get; set; }
        public string Company { get; set; }
        public string Address1 { get; set; }
        public string CityStZip { get; set; }
        public string SampleEntryInformation { get; set; }
        public List<string> Growers { get; set; }
    }
}