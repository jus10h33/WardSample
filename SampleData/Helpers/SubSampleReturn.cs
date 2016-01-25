using SampleData.Models;
using SampleData.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleData.Helpers
{
    public class SubSampleReturn
    {
        // Generic Info
        public GenericInfo GenericInfo { get; set; }

        // Masters
        public GenericMasters GenericMasters { get; set; }

        // SubSample Specific
        public List<SubSampleTypeModels> SubSampleTypes { get; set; }
        public List<SubSampleInfoModels> SubSampleInfos { get; set; }
    }
}