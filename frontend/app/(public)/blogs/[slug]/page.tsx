interface BlogDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = await params;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold capitalize">Blog: {slug}</h1>
      <p className="mt-4 text-muted-foreground">Blog post details content.</p>
    </div>
  );
}
