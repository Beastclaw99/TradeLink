
// Only modify the relevant part to fix the build error
// We need to ensure that payments have a created_at property

const fetchDashboardData = async () => {
  try {
    setIsLoading(true);
    
    // First get the professional's profile to get their skills
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('skills')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Set skills array or default to empty array
    const userSkills = profileData?.skills || [];
    setSkills(userSkills);
    
    // Fetch projects that match skills (if skills are available)
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select(`
        *,
        client:profiles(first_name, last_name)
      `)
      .eq('status', 'open');
    
    if (projectsError) throw projectsError;
    
    // Filter projects by skills if skills are available
    let filteredProjects = projectsData || [];
    if (userSkills.length > 0) {
      // This is a simple filter - in real world you might want more complex matching
      filteredProjects = projectsData.filter((project: any) => {
        const projTags = project.tags || [];
        return userSkills.some((skill: string) => 
          projTags.includes(skill) || 
          project.title.toLowerCase().includes(skill.toLowerCase()) ||
          project.description?.toLowerCase().includes(skill.toLowerCase())
        );
      });
    }
    
    setProjects(filteredProjects);
    
    // Fetch applications made by the professional
    const { data: appsData, error: appsError } = await supabase
      .from('applications')
      .select(`
        *,
        project:projects(title, status, budget)
      `)
      .eq('professional_id', userId);
    
    if (appsError) throw appsError;
    setApplications(appsData || []);
    
    // Fetch payments for completed projects
    const { data: paymentsData, error: paymentsError } = await supabase
      .from('payments')
      .select(`
        *,
        project:projects(title)
      `)
      .eq('professional_id', userId);
    
    if (paymentsError) throw paymentsError;
    
    // Ensure each payment has a created_at field, using current date as fallback
    const paymentsWithCreatedAt = (paymentsData || []).map(payment => ({
      ...payment,
      created_at: payment.created_at || new Date().toISOString()
    }));
    
    setPayments(paymentsWithCreatedAt);
    
    // Fetch reviews for the professional
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('professional_id', userId);
    
    if (reviewsError) throw reviewsError;
    setReviews(reviewsData || []);
    
  } catch (error: any) {
    console.error('Error fetching data:', error);
    toast({
      title: "Error",
      description: "Failed to load dashboard data. Please try again later.",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};
