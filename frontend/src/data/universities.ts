export interface University {
  id: string;
  name: string;
  location: string;
  majors: Major[];
}

export interface Major {
  id: string;
  name: string;
  description: string;
}

export const universities: University[] = [
  {
    id: "berkeley",
    name: "University of California, Berkeley",
    location: "Berkeley, CA",
    majors: [
      {
        id: "cs",
        name: "Computer Science",
        description: "Study of computers and computational systems",
      },
    ],
  },
  {
    id: "hpi",
    name: "Hasso Plattner Institute",
    location: "Berlin, Germany",
    majors: [
      {
        id: "dh",
        name: "Digital Health",
        description: "Study of digital health and its impact on healthcare",
      },
    ],
  },
];
