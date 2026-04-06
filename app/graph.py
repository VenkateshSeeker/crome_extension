from langgraph.graph import StateGraph
from app.parser import extract_filters
from typing import TypedDict


class FilterState(TypedDict):
    query: str
    filters: dict


def parse_node(state):

    query = state["query"]

    filters = extract_filters(query)

    return {"filters": filters}


def validate_node(state):

    filters = state["filters"]

    if "cheap" in state["query"]:
        filters["price_max"] = 4000

    return {"filters": filters}


builder = StateGraph(FilterState)

builder.add_node("parse", parse_node)
builder.add_node("validate", validate_node)

builder.set_entry_point("parse")

builder.add_edge("parse", "validate")

graph = builder.compile()
