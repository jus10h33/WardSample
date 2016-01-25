using SampleData.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleData.Helpers
{
    public class GenericMasters
    {
        public List<SampleTypeModels> SampleTypes { get; set; }
        public List<SampleColumns> SampleColumns { get; set; }
    }
}