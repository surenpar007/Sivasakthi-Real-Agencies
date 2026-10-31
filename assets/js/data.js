/*  SIVASAKTHI REAL AGENCIES — site content
    ------------------------------------------------------------
    Edit this file to change phone numbers, listings and the plot map.
    Prices are in rupees (960000 = ₹9.60 L, 11000000 = ₹1.10 Cr).
    Images live in assets/img/ — add a new .webp file and use its name.
    type must be one of: plot, farm, commercial, home
*/
window.SIVA = {
  business: {
    name: "Sivasakthi Real Agencies",
    owner: "C. Sureshkumar",
    phones: ["95851 78509", "98947 33659"],
    whatsapp: "919585178509",          // country code + number, no spaces
    address: "Shop No. 1, Pillur Main Road, Janakiraman Street, Panampattu, Villupuram 605 103"
  },

  /* Live projects with the Deepavali offer (from Sivasakthi's own posters) */
  projects: [
    { id: "MGR-EXT", name: "MGR Nagar Extension", tamil: "எம்.ஜி.ஆர். நகர் விரிவாக்கம்",
      location: "Vazhudhareddy, Villupuram", tamilLocation: "வழுதரெட்டி, விழுப்புரம்",
      oldRate: 1000, rate: 481, area: 1975.25, areaLabel: "1,975¼ sq.ft",
      poster: "poster-mgr", img: "aerial-960", phone: "98947 33659" },
    { id: "SRI-RAJ", name: "Sri Rajeswari Nagar", tamil: "ஸ்ரீ ராஜேஸ்வரி நகர்",
      location: "V. Maruthur, Villupuram", tamilLocation: "வி. மருதூர், விழுப்புரம்",
      oldRate: 1000, rate: 850, area: 1500, areaLabel: "1,500 sq.ft",
      poster: "poster-rajeswari", img: "stonesunset-960", phone: "98947 33659" }
  ],

  /* Set to false once the sample listings below are replaced with real ones */
  showSampleNote: true,

  properties: [
    { id: "MGR-EXT", real: true, offer: true, type: "plot", tag: "Deepavali offer", name: "MGR Nagar Extension", location: "Vazhudhareddy, Villupuram",
      img: "aerial-960", rate: 481, oldRate: 1000, price: 950095, featured: true,
      specs: [["Total area", "1,975¼ sq.ft"], ["", "Limited plots"]] },

    { id: "SRI-RAJ", real: true, offer: true, type: "plot", tag: "Deepavali offer", name: "Sri Rajeswari Nagar", location: "V. Maruthur, Villupuram",
      img: "stonesunset-960", rate: 850, oldRate: 1000, price: 1275000, featured: true,
      specs: [["Total area", "1,500 sq.ft"], ["", "Limited plots"]] },

    { id: "SN-01", type: "plot", tag: "DTCP plot", name: "Sivasakthi Nagar", location: "Vikravandi",
      img: "ground-960", price: 960000, featured: true,
      specs: [["Area", "1,200 sq.ft"], ["", "2.75 cents"], ["", "30 ft road"]] },

    { id: "KC-09", type: "plot", tag: "Corner plot", name: "Kandamangalam Corner", location: "Kandamangalam",
      img: "cornerpin-960", price: 1680000, featured: true,
      specs: [["Area", "2,400 sq.ft"], ["", "5.51 cents"], ["", "Two road frontage"]] },

    { id: "GH-02", type: "plot", tag: "Hill view", name: "Gingee Hill View Plots", location: "Gingee",
      img: "mistylayout-960", price: 1080000, featured: true,
      specs: [["Area", "1,800 sq.ft"], ["", "4.13 cents"], ["", "Lake and hills"]] },

    { id: "PA-07", type: "plot", tag: "Park layout", name: "Sivasakthi Park Avenue", location: "Panampattu",
      img: "parklayout-960", price: 1350000, featured: true,
      specs: [["Area", "1,500 sq.ft"], ["", "3.44 cents"], ["", "Central park"]] },

    { id: "SG-04", type: "plot", tag: "Gated layout", name: "Sivasakthi Gardens", location: "Panampattu",
      img: "aerial-960", price: 1275000, featured: false,
      specs: [["Area", "1,500 sq.ft"], ["", "3.44 cents"], ["", "Avenue palms"]] },

    { id: "TV-03", type: "plot", tag: "Tree view", name: "Valavanur Tree View Plots", location: "Valavanur",
      img: "shadeplot-960", price: 1140000, featured: false,
      specs: [["Area", "1,500 sq.ft"], ["", "3.44 cents"], ["", "Shaded frontage"]] },

    { id: "RS-01", type: "farm", tag: "Farm land", name: "Koliyanur Red Soil Acres", location: "Koliyanur",
      img: "stonesunset-960", price: 7200000, featured: true,
      specs: [["Area", "4 acres"], ["", "Red loam"], ["", "Patta clear"]] },

    { id: "HF-01", type: "commercial", tag: "Commercial", name: "Main Road Frontage", location: "Vikravandi",
      img: "nightlayout-960", price: 11000000, featured: false,
      specs: [["Area", "25 cents"], ["", "10,890 sq.ft"], ["", "Lit 60 ft road"]] },

    { id: "HP-02", type: "home", tag: "Plot + house plan", name: "Ready-to-build Plot", location: "Kandamangalam",
      img: "wireframe-960", price: 2400000, featured: true,
      specs: [["Plot", "40 × 60 ft"], ["Plan", "2 floors"], ["", "Builder tie-up"]] }
  ],

  /* Layout plan (top-down photo) on the home hero and the Land for sale page.
     x, y, w, h are pixel positions on assets/img/topdown.webp at its original 1672 × 941 size. */
  plan: {
    name: "Sivasakthi Nagar",
    place: "Vikravandi",
    ratePerSqft: 800,
    roads: ["40 ft main road (east–west)", "30 ft road (north–south)"],
    plots: [
      { id: "A-01", x: 52, y: 52, w: 153, h: 308, size: "30 × 60 ft", area: 1800, facing: "South", status: "a" },
      { id: "A-02", x: 205, y: 52, w: 140, h: 308, size: "30 × 60 ft", area: 1800, facing: "South", status: "s" },
      { id: "A-03", x: 345, y: 52, w: 145, h: 308, size: "30 × 60 ft", area: 1800, facing: "South", status: "a" },
      { id: "A-04", x: 490, y: 52, w: 138, h: 308, size: "30 × 60 ft", area: 1800, facing: "South", status: "b" },
      { id: "A-05", x: 628, y: 52, w: 94, h: 308, size: "25 × 60 ft", area: 1500, facing: "South", status: "a" },
      { id: "B-01", x: 912, y: 52, w: 148, h: 308, size: "30 × 60 ft", area: 1800, facing: "South", status: "a" },
      { id: "B-02", x: 1060, y: 52, w: 180, h: 308, size: "35 × 60 ft", area: 2100, facing: "South", status: "b" },
      { id: "B-03", x: 1240, y: 52, w: 198, h: 308, size: "35 × 60 ft", area: 2100, facing: "South", status: "a" },
      { id: "B-04", x: 1438, y: 52, w: 162, h: 308, size: "30 × 60 ft", area: 1800, facing: "South", status: "b" },
      { id: "B-05", x: 1600, y: 52, w: 72, h: 308, size: "25 × 60 ft", area: 1500, facing: "South", status: "a" },
      { id: "C-01", x: 50, y: 548, w: 147, h: 314, size: "30 × 60 ft", area: 1800, facing: "North", status: "s" },
      { id: "C-02", x: 197, y: 548, w: 148, h: 314, size: "30 × 60 ft", area: 1800, facing: "North", status: "a" },
      { id: "C-03", x: 345, y: 548, w: 142, h: 314, size: "30 × 60 ft", area: 1800, facing: "North", status: "a" },
      { id: "C-04", x: 487, y: 548, w: 138, h: 314, size: "30 × 60 ft", area: 1800, facing: "North", status: "a" },
      { id: "C-05", x: 625, y: 548, w: 97, h: 314, size: "25 × 60 ft", area: 1500, facing: "North", status: "b" },
      { id: "D-01", x: 912, y: 548, w: 150, h: 314, size: "30 × 60 ft", area: 1800, facing: "North", status: "a" },
      { id: "D-02", x: 1062, y: 548, w: 156, h: 314, size: "30 × 60 ft", area: 1800, facing: "North", status: "a" },
      { id: "D-03", x: 1218, y: 548, w: 152, h: 314, size: "30 × 60 ft", area: 1800, facing: "North", status: "a" },
      { id: "D-04", x: 1370, y: 548, w: 145, h: 314, size: "30 × 60 ft", area: 1800, facing: "North", status: "a" },
      { id: "D-05", x: 1515, y: 548, w: 157, h: 314, size: "30 × 60 ft", area: 1800, facing: "North", status: "s" }
    ]
  }
};
