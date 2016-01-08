using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleData.Helpers
{
    public class ResultsFor
    {
        public string Grower { get; set;}

        public ResultsFor(string grower)
        {
            this.Grower = grower;
        }
    }
}