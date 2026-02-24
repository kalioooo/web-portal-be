import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    project_category: { type: String, default: '' },
    project_type: { type: String, default: '' },
    status: { type: String, enum: ['published', 'draft', 'archived', 'ongoing', 'completed'], default: 'draft' },
    short_description: { type: String, default: '' },
    thumbnail_image: { type: String, default: '' },
    tags: [String],
    problem_statement: { type: String, default: '' },
    solution_overview: { type: String, default: '' },
    your_role: { type: String, default: '' },
    tech_stack: [String],
    architecture_type: { type: String, default: '' },
    deployment_method: { type: String, default: '' },
    core_features: [String],
    technical_challenges: [String],
    how_challenges_were_solved: [String],
    measurable_results: [String],
    github_link: { type: String, default: '' },
    live_demo_link: { type: String, default: '' },
    video_demo_link: { type: String, default: '' },
    start_date: { type: String, default: '' },
    end_date: { type: String, default: '' },
    ai_search_text: { type: String, default: '' },
    embedding_vector: [Number],
    ai_summary: { type: String, default: '' },
  },
  { timestamps: true }
);

projectSchema.index({ slug: 1 }, { unique: true });
projectSchema.index({ status: 1 });

export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
