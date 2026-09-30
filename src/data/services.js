// Services published on the current Regardin Construction website (MASTER_PROMPT.md §6.2,
// evidence register E011–E013). Work types in `includes` come from the old site's service
// list and portfolio labels. No prices, durations, materials, warranties or specifications
// are stated anywhere, because none has been confirmed.
//
// `image` is the intended filename in src/images/. Missing files render as a placeholder
// block and are listed in docs/TODO_CONFIRM.md.

export const services = [
  {
    slug: 'carpentry-decking-pergolas',
    name: 'Carpentry, decking and pergolas',
    short: 'Timber decks, pergolas and patios outside; walk-in closets, countertops and other carpentry inside.',
    intro:
      'Timber work for the outside and inside of your home. Outside, that means decks, timber pergolas and patios. Inside, it means carpentry such as walk-in closets and countertops.',
    includes: ['Timber decking', 'Timber pergolas', 'Patios', 'Walk-in closets', 'Countertops', 'General carpentry'],
    send: [
      'Photos of the area, including anything the deck or pergola will attach to',
      'Rough measurements, and whether the deck sits at ground level or is raised',
      'The finish or look you have in mind, with example photos if you have them',
    ],
    image: 'service-carpentry-decking-pergolas',
    imageNote: 'A finished timber deck or pergola, ideally with a close-up of the timber detail',
    metaTitle: 'Carpentry, Decking and Pergolas in Cape Town',
    metaDescription:
      'Timber decks, pergolas, patios and interior carpentry such as walk-in closets and countertops, by Regardin Construction in Cape Town.',
  },
  {
    slug: 'renovations-alterations',
    name: 'Renovations and alterations',
    short: 'Renovations of existing homes, alterations to rooms and layouts, and maintenance work.',
    intro:
      'Renovation and alteration work on existing homes in Cape Town, from updating a room to reworking a house that needs a full refresh, plus maintenance work on homes that need repairs.',
    includes: ['Home renovations', 'Alterations', 'Maintenance and repairs'],
    send: [
      'Photos of each room or area involved',
      'A short description of what you want changed',
      'Plans or drawings, if you have them',
      'When you would like the work done',
    ],
    image: 'service-renovations-alterations',
    imageNote: 'A renovated room, ideally as a before-and-after pair from the same angle',
    metaTitle: 'Home Renovations and Alterations in Cape Town',
    metaDescription:
      'Renovations, alterations and maintenance for homes in Cape Town by Regardin Construction. Send photos of your project to request a quote.',
  },
  {
    slug: 'brickwork-boundary-walls',
    name: 'Brickwork and boundary walls',
    short: 'Brickwork for boundary walls and building work around the home.',
    intro: 'Brickwork on residential properties in Cape Town, including boundary walls.',
    includes: ['Boundary walls', 'General brickwork'],
    send: [
      'Photos of the site and the line of the wall',
      'The approximate length and height you have in mind',
      'Whether the wall should be plastered and painted',
    ],
    image: 'service-brickwork-boundary-walls',
    imageNote: 'A finished boundary wall, plus a close-up of the brick or plaster finish',
    metaTitle: 'Brickwork and Boundary Walls in Cape Town',
    metaDescription:
      'Brickwork and boundary walls for homes in Cape Town by Regardin Construction. Send photos and measurements to request a quote.',
  },
  {
    slug: 'concrete-work',
    name: 'Concrete work',
    short: 'Driveways, slabs, concrete stairs, concrete walls and pool structures.',
    intro: 'Concrete work for homes in Cape Town: driveways, slabs, stairs, walls and pool structures.',
    includes: ['Driveways', 'Slabs', 'Concrete stairs', 'Concrete walls', 'Pool structures'],
    send: [
      'Photos of the area',
      'Approximate measurements',
      'What the concrete is for, for example a driveway, a slab for a room or a set of stairs',
    ],
    image: 'service-concrete-work',
    imageNote: 'Finished concrete stairs or a driveway, with a close-up of the edge and finish',
    metaTitle: 'Concrete Work in Cape Town: Driveways, Slabs and Stairs',
    metaDescription:
      'Concrete driveways, slabs, stairs, walls and pool structures for homes in Cape Town by Regardin Construction.',
  },
  {
    slug: 'plastering-screeds-pool-plastering',
    name: 'Plastering, screeds and pool plastering',
    short: 'Scratch plaster on walls, floor screeds and pool plastering.',
    intro:
      'Plaster and screed work for homes in Cape Town: scratch plaster on walls, floor screeds and pool plastering.',
    includes: ['Scratch plaster', 'Floor screeds', 'Pool plastering'],
    send: [
      'Photos of the walls, floor or pool',
      'The approximate area in square metres',
      'For pools, the pool size and the state of the current surface',
    ],
    image: 'service-plastering-screeds',
    imageNote: 'A freshly plastered pool or a screeded floor, with a close-up of the surface texture',
    metaTitle: 'Plastering, Floor Screeds and Pool Plastering in Cape Town',
    metaDescription:
      'Scratch plaster, floor screeds and pool plastering for homes in Cape Town by Regardin Construction.',
  },
  {
    slug: 'painting',
    name: 'Painting',
    short: 'Interior and exterior painting for homes.',
    intro: 'Interior and exterior painting for homes in Cape Town.',
    includes: ['Exterior painting', 'Interior painting'],
    send: [
      'Photos of the walls or rooms to be painted',
      'Whether the job is inside, outside or both',
      'The colours or finish you have in mind, if you know them',
    ],
    image: 'service-painting',
    imageNote: 'A freshly painted house exterior',
    metaTitle: 'Interior and Exterior Painting in Cape Town',
    metaDescription:
      'Interior and exterior house painting in Cape Town by Regardin Construction. Send photos of the job to request a quote.',
  },
  {
    slug: 'custom-projects',
    name: 'Custom projects',
    short: 'One-off building and timber pieces made to your idea.',
    intro:
      'Some jobs do not fit a standard category. If you have an idea for a one-off piece of building or timber work at your home, send it through and we will talk it over.',
    includes: ['One-off building work', 'One-off timber pieces'],
    send: ['A description or sketch of the idea', 'Photos of where it will go', 'Any example photos you like'],
    image: 'service-custom-projects',
    imageNote: 'A finished one-off piece that shows what a custom project can be',
    metaTitle: 'Custom Building and Timber Projects in Cape Town',
    metaDescription: 'One-off building and timber projects made to your idea, by Regardin Construction in Cape Town.',
  },
];
