"""Knowledge Graph Layer (Nodes, Edges, GraphBuilder & GraphSearchEngine)."""
from typing import Dict, Any, List, Set
from pydantic import BaseModel, Field


class GraphNode(BaseModel):
    node_id: str
    node_type: str  # Dataset, Float, Profile, Variable, Region, Provider
    label: str
    attributes: Dict[str, Any] = Field(default_factory=dict)


class GraphEdge(BaseModel):
    source_id: str
    target_id: str
    relation: str  # belongs_to, contains, measured_at, located_in, generated_by


class KnowledgeGraphBuilder:
    """Constructs knowledge graph nodes and edges from scientific ocean records."""

    def __init__(self):
        self.nodes: Dict[str, GraphNode] = {}
        self.edges: List[GraphEdge] = []

    def add_node(self, node: GraphNode) -> None:
        self.nodes[node.node_id] = node

    def add_edge(self, edge: GraphEdge) -> None:
        self.edges.append(edge)

    def build_profile_graph(self, profile_data: Dict[str, Any]) -> None:
        platform_id = str(profile_data.get("platform_id", "2901234"))
        region_name = profile_data.get("ocean_region", "Bay of Bengal")
        prof_id = f"prof_{platform_id}"
        float_id = f"float_{platform_id}"
        region_id = f"region_{region_name.lower().replace(' ', '_')}"

        # Nodes
        self.add_node(GraphNode(node_id=float_id, node_type="Float", label=f"ARGO Float #{platform_id}"))
        self.add_node(GraphNode(node_id=prof_id, node_type="Profile", label=f"Profile {prof_id}"))
        self.add_node(GraphNode(node_id=region_id, node_type="Region", label=region_name))

        # Edges
        self.add_edge(GraphEdge(source_id=prof_id, target_id=float_id, relation="generated_by"))
        self.add_edge(GraphEdge(source_id=prof_id, target_id=region_id, relation="located_in"))


class GraphSearchEngine:
    """Queries connected graph nodes and relationships."""

    def __init__(self, builder: KnowledgeGraphBuilder):
        self.builder = builder

    def find_neighbors(self, node_id: str) -> List[GraphNode]:
        neighbor_ids = set()
        for edge in self.builder.edges:
            if edge.source_id == node_id:
                neighbor_ids.add(edge.target_id)
            elif edge.target_id == node_id:
                neighbor_ids.add(edge.source_id)

        return [self.builder.nodes[nid] for nid in neighbor_ids if nid in self.builder.nodes]
