/**
 * The person the video's app captures show: entirely fictional, so the demo is
 * about the tool. The app's "Load Sample Data" is the author's own CV and is
 * not used here. Name and title follow the editor's placeholders (Alex Rivera); every
 * company, school and project here is invented, and the contact details use
 * reserved example domains and the fictional 555 range.
 */
export const PERSONA = {
  personalInfo: {
    name: 'Alex Rivera',
    title: 'Senior Full-Stack Engineer',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://alexrivera.example',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  summary:
    'Full-stack engineer with nine years of experience building web products end to end, from data models and APIs to the interfaces people use every day. Comfortable owning a feature from the first sketch to production, and happiest on small teams that ship often.',
  experience: [
    {
      id: 'exp-1',
      company: 'Lumacrest Payments',
      position: 'Senior Full-Stack Engineer',
      startDate: '2021-03',
      endDate: 'Present',
      description: 'Payments platform for independent retailers.',
      achievements: [
        'Led the rebuild of the merchant dashboard in React and TypeScript, cutting page load time by 40%.',
        'Designed the reconciliation service in Node.js and PostgreSQL that settles 2M transactions a day.',
        'Introduced a shared component library adopted by four product teams.',
        'Mentored five engineers through their first year on the team.',
      ],
    },
    {
      id: 'exp-2',
      company: 'Fernvale Health',
      position: 'Full-Stack Engineer',
      startDate: '2018-01',
      endDate: '2021-02',
      description: 'Scheduling and records software for community clinics.',
      achievements: [
        'Built the patient scheduling flow used by 300 clinics, with WCAG AA accessibility.',
        'Moved the reporting pipeline to GraphQL, removing a nightly batch job.',
        'Reduced appointment no-shows by 18% with SMS reminders and a rescheduling link.',
      ],
    },
    {
      id: 'exp-3',
      company: 'Brightpine Analytics',
      position: 'Software Engineer',
      startDate: '2016-06',
      endDate: '2017-12',
      description: 'Analytics tools for small marketing teams.',
      achievements: [
        'Shipped the first version of the campaign dashboard in React and D3.',
        'Wrote the data import that brought in customers from three ad platforms.',
      ],
    },
  ],
  education: [
    { id: 'edu-1', institution: 'Northbay University', degree: 'B.S.', field: 'Computer Science', startDate: '2012', endDate: '2016' },
  ],
  skills: [
    { id: 'sk-1', category: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Accessibility'] },
    { id: 'sk-2', category: 'Backend', items: ['Node.js', 'PostgreSQL', 'GraphQL', 'REST APIs', 'Redis'] },
    { id: 'sk-3', category: 'Cloud & Tools', items: ['AWS', 'Docker', 'Terraform', 'CI/CD', 'Observability'] },
  ],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'native' },
    { id: 'lang-2', language: 'Spanish', proficiency: 'fluent' },
  ],
  projects: [
    { id: 'pr-1', name: 'Ledgerline', description: 'An open-source budgeting app for households, with shared accounts.', technologies: ['Next.js', 'PostgreSQL'] },
    { id: 'pr-2', name: 'Pulsekit', description: 'A small library of real-time dashboard widgets.', technologies: ['TypeScript', 'WebSockets'] },
  ],
  certifications: [{ id: 'cert-1', name: 'AWS Certified Developer, Associate', issuer: 'Amazon Web Services', date: '2022' }],
  publications: [],
  volunteerWork: [],
  awards: [],
  interests: ['Open source', 'Cycling', 'Board games'],
};

/** The job the AI section tailors the CV to. The company is invented too. */
export const JOB = `Senior Frontend Engineer at Mendwell, a healthcare scheduling startup.

We're looking for someone to lead our patient-facing web app: React and TypeScript, a design system used across products, and accessibility as a requirement, not a nice-to-have. You'll work closely with design, own performance, and mentor two engineers. Experience with healthcare or other regulated products is a plus.`;
