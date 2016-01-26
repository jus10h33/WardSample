using SampleData.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleData.Helpers
{
    public class PlantReturn
    {
        // Generic Info
        public GenericInfo GenericInfo { get; set; }

        // Masters
        public GenericMasters GenericMasters { get; set; }

        // Plant Specfic
        public List<SubSampleTypeModels> SubSampleTypes { get; set; }
        public List<List<SubSubSampleTypeModels>> SubSubSampleTypes { get; set; }
        public List<SubSampleInfoModels> SubSampleInfos { get; set; }
    }
}